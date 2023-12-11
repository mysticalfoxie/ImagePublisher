using CefSharp;
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
        Log.Write("Preparing emulated browser...");
        _context = context;
        _emulator = new BrowserEmulator();
        _window = _emulator.Window;
        _browser = _emulator.Browser;
        Log.Overwrite("Preparing emulated browser... @gDone!");
    }
    
    public void AddTagsToPost()
    {
        LaunchBrowser();
        EnsureLoggedIn();
        VisitEditDeviationPage();
        EnsurePageExists();
        WaitForScriptsToComplete();
        EnterTagsToTextField();
        AddCharacter();
        AddLocation();
        PressSubmitButton();
        WaitForNavigation();
    }

    private void WaitForNavigation()
    {
        Log.Write("Waiting for WebPage to process...");
        _emulator.Browser.WaitForNavigationAsync().Wait();
        Log.Overwrite("Waiting for WebPage to process... @gDone!");
        
        if (!_context.Config.DeviantArt.LaunchBrowserAfterEdit.GetValueOrDefault()) return;
        
        Log.Write("Starting default browser at address...");
            DeviceBrowser.OpenUrl(_browser.Address);
        Log.Overwrite($"Starting default browser at address... @gOpened! @d{_browser.Address}");
    }

    private void AddLocation()
    {
        Log.Write("Adding location information...");
        if (!_context.Config.DeviantArt.AddLocation.GetValueOrDefault())
        {
            Log.Overwrite("Adding location information... @dSkipped!");
            return;
        }

        const string JS_UPDATE_LOCATION = "document.querySelector('span.ile-advanced-submit-mode input[name=\"ile-ec-location\"]').value = ";
        var updateScript = JS_UPDATE_LOCATION + '"' + _context.Config.DeviantArt.Location + '"';
        _browser.ExecuteScriptAsync(updateScript);
        Log.Overwrite("Adding location information... @gAdded!");
    }

    private void AddCharacter()
    {
        Log.Write("Adding character information...");

        if (!_context.Config.DeviantArt.AddCharacter.GetValueOrDefault())
        {
            Log.Overwrite("Adding character information... @dSkipped!");
            return;
        }

        const string JS_UPDATE_SWITCH_VALUE = "document.querySelector('ul.ec-tag-fields li.ec-tag-field select').value = 4;";
        _browser.ExecuteScriptAsync(JS_UPDATE_SWITCH_VALUE);
        
        const string JS_UPDATE_CHARACTER = "document.querySelector('ul.ec-tag-fields li.ec-tag-field div').innerText = ";
        var updateScript = JS_UPDATE_CHARACTER + '"' + _context.Config.DeviantArt.Character + '"';
        _browser.ExecuteScriptAsync(updateScript);
        Log.Overwrite("Adding character information... @gAdded!");
    } 
    
    private void PressSubmitButton()
    {
        Log.Write("Pressing submit button...");
        const string JS_FETCH_SUBMIT_BUTTON = "const submitButton = document.querySelector('div.ile-footer button.ile-submit-button');";
        const string JS_FOCUS_BUTTON = "submitButton.focus();";
        const string JS_CLICK_BUTTON = "submitButton.click();";
        _browser.ExecuteScriptAsync(JS_FETCH_SUBMIT_BUTTON);
        _browser.ExecuteScriptAsync(JS_FOCUS_BUTTON);
        Task.Delay(1000).Wait();
        _browser.ExecuteScriptAsync(JS_CLICK_BUTTON);
        Log.Overwrite("Pressing submit button... @gDone!");
    }

    private static void WaitForScriptsToComplete()
    {
        Log.Write("Waiting for javascript to complete...");

        for (var i = 3; i > 0; i--)
        {
            Task.Delay(1000).Wait();
            Log.Overwrite($"Waiting for javascript to complete... @dWaiting {i} second(s)");
        }
        
        Log.Overwrite("Waiting for javascript to complete... @gDone!              ");
    }

    private void EnterTagsToTextField()
    {
        Log.Write("Adding tags to tag input field...");
        
        const string JS_FETCH_INPUT_QUERY = "const tagsInput = document.getElementById('serialized_tags').parentElement;";
        _browser.ExecuteScriptAsync(JS_FETCH_INPUT_QUERY);

        const string JS_FOCUS_INPUT_QUERY = "tagsInput.focus()";
        _browser.ExecuteScriptAsync(JS_FOCUS_INPUT_QUERY);
        
        Task.Delay(200).Wait();

        var host = _browser.GetBrowserHost();
        foreach (var character in _context.Config.DeviantArt.Tags)
            host.EnterChar(character);

        const string JS_BLUR_INPUT_QUERY = "tagsInput.blur()";
        _browser.ExecuteScriptAsync(JS_BLUR_INPUT_QUERY);
        
        Task.Delay(200).Wait();
        
        Log.Overwrite("Adding tags to tag input field... @gDone!");
    }

    private void EnsurePageExists()
    {
        const string JS_QUERY = "document.body.classList.contains('error-404')";
        if (_browser.EvaluateScriptAsync<bool>(JS_QUERY).Result)
            throw new InvalidOperationException("The deviation could not be found at the address.");
    }

    private void LaunchBrowser()
    {
        Log.Write("Launching emulated browser at DeviantArt Webpage...");
        _emulator.Start();
        _emulator.Navigate("https://www.deviantart.com/");
        Log.Overwrite("Launching emulated browser at DeviantArt Webpage... @gStarted!");
    }

    private void VisitEditDeviationPage()
    {
        Log.Write("Navigate to edit page for deviation...");
        var id = _context.Config.DeviantArt.SkipPublish.GetValueOrDefault() 
            ? _context.Config.DeviantArt.DeviationId 
            : _context.DeviationId;
        
        _emulator.Navigate($"https://www.deviantart.com/deviation/edit/{id}");
        Log.Overwrite("Navigate to edit page for deviation... @gNavigated!");
    }

    private void EnsureLoggedIn()
    {
        Log.Write("Ensuring the user is logged in...");
        if (_browser.HasDeviantArtAuthCookie())
        {
            Log.Overwrite("Ensuring the user is logged in... @gLogged in!");
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