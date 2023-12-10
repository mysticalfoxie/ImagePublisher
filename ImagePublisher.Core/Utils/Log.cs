namespace ImagePublisher.Core.Utils;

public static class Log
{
    public static void Write(string format, params object[] args)
    {
        Write(string.Format(format, args));
    }

    public static void Overwrite(string format, params object[] args)
    {
        Overwrite(string.Format(format, args));
    }
    
    public static void Overwrite(string text)
    {
        Console.CursorTop -= 1;
        Write(text);
    }
    
    public static void Write(string text)
    {
        // Text might me something like : Hello \gFoo\c
        var current = text;
        if (current.StartsWith("@g"))
            Console.ForegroundColor = ConsoleColor.Green;
        if (current.StartsWith("@d"))
            Console.ForegroundColor = ConsoleColor.DarkGray;
        if (current.StartsWith("@r"))
            Console.ForegroundColor = ConsoleColor.Red;
        if (current.StartsWith("@y"))
            Console.ForegroundColor = ConsoleColor.Yellow;
        if (current.StartsWith("@r")) 
            Console.ResetColor();

        if (current.StartsWith("@"))
            current = text[2..];

        var index = current.IndexOf("@", StringComparison.InvariantCulture);
        if (index == -1)
        {
            Console.WriteLine(current);
            Console.ResetColor();
            return;
        }

        var span = current[..index];
        Console.Write(span);
        
        // ReSharper disable once TailRecursiveCall
        Write(current[index..]);
    }
}