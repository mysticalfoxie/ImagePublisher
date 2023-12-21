using System.Drawing;
using System.Drawing.Imaging;
using ImagePublisher.Web.Host.Interfaces;
using ImagePublisher.Web.Host.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ImagePublisher.Web.Host.Services;

public class PresetsService : IService
{
    private readonly DirectoryInfo _presetsFolder;
    
    public PresetsService()
    {
        var assembly = typeof(Program).Assembly;
        var assemblyFile = new FileInfo(assembly.Location);
        var presetsFolderLocation = Path.Combine(assemblyFile.Directory!.FullName, "presets");
        _presetsFolder = new DirectoryInfo(presetsFolderLocation);
        if (!_presetsFolder.Exists) _presetsFolder.Create();
    }
    
    public async Task<PresetMetaDataModel> AddPreset(PresetFormData form, PresetModel data)
    {
        data.Id = Guid.NewGuid();
        var metadata = CreateMetaData(data);
        var directory = _presetsFolder.CreateSubdirectory(data.Id.ToString());
        var tasks = await GetPresetCreationTasks(data, metadata, form, directory); // ✨ Multi-Threading UwU ✨
        await Task.WhenAll(tasks);
        
        //metadata.PreviewImageUrl = "http"
        
        return metadata;
    }

    private static PresetMetaDataModel CreateMetaData(PresetModel model)
    {
        return new PresetMetaDataModel
        {
            Id = model.Id,
            Title = model.General.Title,
            Description = model.General.Description,
            TagCount = model.General.Tags.Length,
            CreatedAt = DateTime.UtcNow
        };
    }

    private static async Task<IEnumerable<Task>> GetPresetCreationTasks(
        PresetModel data, 
        PresetMetaDataModel metadata, 
        PresetFormData form,
        DirectoryInfo directory)
    {
        var tasks = new List<Task>
        {
            CreatePresetDataFile(data, directory),
            CreatePresetMetaDataFile(metadata, directory)
        };
        
        if (data.General.UseHDLDImages)
        {
            tasks.AddRange(await ReadImageAndGetSavingTasks("hd_image", form.HDImage, directory));
            tasks.AddRange(await ReadImageAndGetSavingTasks("ld_image", form.LDImage, directory));
        }
        else
        {
            tasks.AddRange(await ReadImageAndGetSavingTasks("image", form.Image, directory));
        }

        return tasks;
    }

    private static async Task<IEnumerable<Task>> ReadImageAndGetSavingTasks(string name, IFormFile file, DirectoryInfo directory)
    {
        var image = await ReadFileAsync(file);
        var extension = GetFileExtensionsByContentType(file.ContentType);
        return new[]
        {
            SaveImage(name, extension, image, directory),
            SavePreviewImage(image, directory)
        };
    }

    private static async Task<byte[]> ReadFileAsync(IFormFile file)
    {
        await using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        return memoryStream.ToArray();
    }

    private static async Task SaveImage(string name, string extension, byte[] image, DirectoryInfo directory)
    {
        var filename = name + extension;
        var filepath = Path.Combine(directory.FullName, filename);
        await File.WriteAllBytesAsync(filepath, image);
    }
    
    private static Task SavePreviewImage(byte[] image, DirectoryInfo directory)
    {
        return Task.Factory.StartNew(() =>
        {   // Sizeof: 320 x 180 - JPEG
            using var originalStream = new MemoryStream(image);
            using var originalImage = Image.FromStream(originalStream);
            
            var aspect = (float)originalImage.Width / originalImage.Height;
            const int HEIGHT = 180;
            var width = (int)(aspect * HEIGHT);

            using var newImage = new Bitmap(width, HEIGHT);
            using (var graphics = Graphics.FromImage(newImage))
                graphics.DrawImage(originalImage, 0, 0, width, HEIGHT);

            var filepath = Path.Combine(directory.FullName, "thumbnail.jpeg");
            newImage.Save(filepath, ImageFormat.Jpeg);
        });
    }

    private static string GetFileExtensionsByContentType(string contentType)
    {
        return contentType switch
        {
            "image/jpg" => ".jpg",
            "image/png" => ".png",
            "image/jpeg" => ".jpeg",
            _ => throw new NotSupportedException("The image type is not supported. Only jpg, png and jpeg are supported.")
        };
    }

    private static async Task CreatePresetMetaDataFile(PresetMetaDataModel model, DirectoryInfo directory)
    {
        var json = JsonConvert.SerializeObject(model);
        var presetFilename = Path.Combine(directory.FullName, "preset.pmd");
        await File.WriteAllTextAsync(presetFilename, json);
    }

    private static async Task CreatePresetDataFile(PresetModel model, DirectoryInfo directory)
    {
        var json = JsonConvert.SerializeObject(model);
        var presetFilename = Path.Combine(directory.FullName, "preset.pd");
        await File.WriteAllTextAsync(presetFilename, json);
    }

    public bool TryOpenThumbnailStream(Guid id, out FileStream stream, out IActionResult error)
    {
        var directory = _presetsFolder.GetDirectories().FirstOrDefault(x => x.Name == id.ToString());
        if (directory is null)
        {
            error = new NotFoundObjectResult($"There is no preset with id of \"{id}\".");
            stream = null;
            return false;
        }

        var file = directory.GetFiles().First(x => x.Name == "thumbnail.jpeg");
        stream = file.OpenRead();
        error = null;
        return true;
    }
}