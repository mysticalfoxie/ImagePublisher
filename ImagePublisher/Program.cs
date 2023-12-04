namespace ImagePublisher;

public class Program
{
    public static void Main(string[] args)
    {
        var filepath = EnsureHasFilepath(args);
        var image = EnsureImageExists(filepath);
        Publisher.PublishOnDeviantArt(image);
    }

    private static string EnsureHasFilepath(string[] args)
    {
        if (args.Length > 0) 
            return args[0];
        
        SendError("Please provide an image location.");
        Environment.Exit(-1);
        return null;
    }

    private static FileInfo EnsureImageExists(string filename)
    {
        var fileInfo = new FileInfo(filename);
        if (!fileInfo.Exists)
        {
            SendError("The provided file does not exists.");
            Environment.Exit(-1);
            return null;
        }

        if (fileInfo.Extension.ToLower() != ".png")
        {
            SendError("The provided file is not a png image.");
            Environment.Exit(-1);
            return null;
        }

        return fileInfo;
    }

    private static void SendError(string message)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine(message);
        Console.ResetColor();
    }
}