using System.Diagnostics;

namespace ImagePublisher;

public static class WebLink
{
    public static void Open(string url)
    {
        var info = new ProcessStartInfo(url) { UseShellExecute = true };
        Process.Start(info);
    }
}