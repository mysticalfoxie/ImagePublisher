namespace ImagePublisher.Browser;

internal static class Program
{
    [STAThread]
    public static void Main()
    {
        using var browser = new BrowserEmulator();
        browser.Start();
    }
}