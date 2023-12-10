using ImagePublisher.Browser;
using ImagePublisher.Core.Models;
using ImagePublisher.Core.Utils;
using ImagePublisher.DeviantArt;
using ImagePublisher.Models;
using Newtonsoft.Json;

namespace ImagePublisher;

public static class Program
{
    private static PublishConfig _config; 
    
    [STAThread]
    public static void Main(string[] args)
    {
        Log.Write("Loading publish file...");
        _config = LoadPublishConfig();
        Log.Overwrite("Loading publish file... @gLoaded!");
        
        Log.Write("Seaching source image...");
        var filepath = EnsureHasFilepath();
        var image = EnsureImageExists(filepath);
        var context = new PublishContext(image, _config);
        Log.Overwrite($"Seaching source image...@g Found@d at '{image.FullName}'");

        if (_config.DeviantArt?.Enabled == true)
            PublishToDeviantArt(context);
        else
            Log.Write("Publish to DeviantArt... @dSkipped.");
    }

    private static void PublishToDeviantArt(PublishContext context)
    {
        Log.Write(" @d--- Publish: DeviantArt ---");

        var publisher = new Publisher();
        publisher.Publish(context).Wait();
    }

    private static PublishConfig LoadPublishConfig()
    {
        var json = File.ReadAllText("publish.json");
        return JsonConvert.DeserializeObject<PublishConfig>(json);
    }

    private static string EnsureHasFilepath()
    {
        if (!string.IsNullOrWhiteSpace(_config.Image))
            return _config.Image;

        Log.Overwrite("Seaching source image... @rFailed!");
        SendError("The launch arguments do not contain an image location.");
        Environment.Exit(-1);
        return null;
    }

    private static FileInfo EnsureImageExists(string filename)
    {
        var fileInfo = new FileInfo(filename);
        if (!fileInfo.Exists)
        {
            Log.Overwrite("Seaching source image... @rFailed!");
            SendError("The provided file does not exists.");
            Environment.Exit(-1);
            return null;
        }

        if (fileInfo.Extension.ToLower() == ".png") 
            return fileInfo;
        
        Log.Overwrite("Seaching source image... @rFailed!");
        SendError("The provided file is not a png image.");
        Environment.Exit(-1);
        return null;
    }

    private static void SendError(string message)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine(message);
        Console.ResetColor();
    }
}