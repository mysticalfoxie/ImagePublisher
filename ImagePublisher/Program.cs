using ImagePublisher.Browser;
using ImagePublisher.Core.Models;
using ImagePublisher.Core.Utils;
using ImagePublisher.Models;
using Newtonsoft.Json;

namespace ImagePublisher;

public static class Program
{
    private static PublishConfig _config; 
    
    [STAThread]
    public static void Main(string[] args)
    { 
        new BrowserEmulator().Start();

        Log.Write("Seaching source image...");
        _config = LoadPublishConfig();
        Log.Overwrite("Seaching source image... @gLoaded!");
        
        Log.Write("Seaching source image...");
        var filepath = EnsureHasFilepath(args);
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

        var publisher = new DeviantArt.Publisher();
        publisher.Publish(context).Wait();
    }

    private static PublishConfig LoadPublishConfig()
    {
        var json = File.ReadAllText("publish.json");
        return JsonConvert.DeserializeObject<PublishConfig>(json);
    }

    private static string EnsureHasFilepath(string[] args)
    {
        if (args.Length > 0) 
            return args[0];
        
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