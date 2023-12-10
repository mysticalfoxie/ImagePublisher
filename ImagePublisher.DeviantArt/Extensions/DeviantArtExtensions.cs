using CefSharp;
using CefSharp.WinForms;
using ImagePublisher.Core.Utils;

namespace ImagePublisher.Browser.Extensions;

public static class DeviantArtExtensions
{
    public static void WaitForDeviantArtAuthCookie(this ChromiumWebBrowser browser)
    {
        using var manager = browser.GetCookieManager();
        Task.Factory.StartNew(async () =>
        {
            bool containsCookie;
            do
            {
                for (var i = 5; i >= 0; i--)
                {
                    Log.Overwrite($"Ensuring the user is logged in... @rNot logged in! @dWaiting for user to log in. Next check in {i + 1}s...");
                    await Task.Delay(1000);
                }
                
                // ReSharper disable once AccessToDisposedClosure
                containsCookie = browser.HasDeviantArtAuthCookie(manager);
                
            } while (!containsCookie);
        }).Wait();
        
        // I know it's a quick and dirty fix, but stfu xD #kiss 
        Log.Overwrite("Ensuring the user is logged in... @rLogged in!                                                            ");
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