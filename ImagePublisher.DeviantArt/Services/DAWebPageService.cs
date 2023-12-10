using CefSharp.WinForms;
using ImagePublisher.Browser;
using ImagePublisher.Browser.Extensions;
using ImagePublisher.Core.Models;
using ImagePublisher.Core.Utils;

namespace ImagePublisher.DeviantArt;

public class DAWebPageService : IDisposable
{
    private readonly BrowserEmulator _emulator;
    private readonly MainForm _window;
    private readonly ChromiumWebBrowser _browser;
    private readonly PublishContext _context;

    public DAWebPageService(PublishContext context)
    {
        Log.Write("Starting emulated browser...");
        _context = context;
        _emulator = new BrowserEmulator();
        _window = _emulator.Window;
        _browser = _emulator.Browser;
        _emulator.Start();
        _browser.LoadUrl("https://www.deviantart.com/");
        Log.Overwrite("Starting emulated browser... @gStarted!");
    }
    
    public async Task AddTagsToPost(PublishContext context)
    {
        EnsureLoggedIn();
        VisitEditDeviationPage(context);
        // EnterTagsToTextField();
        // PressSubmitButton();
    }

    private void VisitEditDeviationPage(PublishContext context)
    {
        Log.Write("Navigate to edit page for deviation...");
        _browser.LoadUrl($"https://www.deviantart.com/deviation/edit/{context.DeviationId}");
        _browser.WaitForNavigationAsync();
        Log.Write("Navigate to edit page for deviation... @gNavigated!");
    }

    private void EnsureLoggedIn()
    {
        Log.Write("Ensuring the user is logged in...");
        if (_browser.HasDeviantArtAuthCookie())
        {
            Log.Write("Ensuring the user is logged in... @gLogged in!");
            _window.Log("User is logged in.");
            return;
        }

        _window.Log("User is not logged in. Please sign in to proceed.");
        _window.Alert("Please sign in to procceed.");
        Log.Overwrite("Ensuring the user is logged in... @rNot logged in! @dWaiting for user to log in.");
        
        _window.Browser.WaitForDeviantArtAuthCookie();
    }

    public void Dispose()
    {
        _emulator.Dispose();
        GC.SuppressFinalize(this);
    }
}