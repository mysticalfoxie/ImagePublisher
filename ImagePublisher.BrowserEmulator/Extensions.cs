using CefSharp;
using CefSharp.WinForms;

namespace ImagePublisher.BrowserEmulator;

public static class Extensions
{
    public static void WaitForDeviantArtAuthCookie(this ChromiumWebBrowser browser)
    {
        using var manager = browser.GetCookieManager();
        Task.Factory.StartNew(async () =>
        {
            bool containsCookie;
            do
            {
                await Task.Delay(5000);
                // ReSharper disable once AccessToDisposedClosure
                containsCookie = browser.HasDeviantArtAuthCookie(manager);
            } while (!containsCookie);
        }).Wait();
    }
    
    public static bool HasDeviantArtAuthCookie(this ChromiumWebBrowser browser)
    {
        using var manager = browser.GetCookieManager();
        return browser.HasDeviantArtAuthCookie(manager);
    }
    
    private static bool HasDeviantArtAuthCookie(this ChromiumWebBrowser browser, ICookieManager manager)
    {
        var visitor = new DeviantArtAuthCookieVisitor();
        var tcs = new TaskCompletionSource<bool>();
        visitor.Complete = () =>
        {
            tcs.SetResult(visitor.HasAuthCookie);
            visitor.Dispose();
        };
        
        manager.VisitUrlCookies(browser.Address, true, visitor);
        tcs.Task.Wait();
        
        return tcs.Task.Result;
    }
}