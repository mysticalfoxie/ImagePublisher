using System.Diagnostics;

namespace ImagePublisher;

public static class DeviceBrowser
{
    public static void OpenUrl(string url)
    {
        var info = new ProcessStartInfo(url) { UseShellExecute = true };
        Process.Start(info);
    }
}