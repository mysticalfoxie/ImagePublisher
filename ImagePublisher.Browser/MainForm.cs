using CefSharp;
using CefSharp.WinForms;

namespace ImagePublisher.Browser;

public partial class MainForm : Form
{
    private bool _initialized;
    private string _address;

    public MainForm()
    {
        InitializeComponent();
        Browser = _browser;
        Browser.LoadingStateChanged += OnLoadingStateChanged;
    }

    public ChromiumWebBrowser Browser { get; }
    public EventHandler<string> UrlLoaded { get; set; }
    public EventHandler InitialLoad { get; set; }

    public void Log(string message)
    {
        Browser.ExecuteScriptAsync($"console.log(\"{message}\");");
    }

    public void Alert(string message)
    {
        Browser.ExecuteScriptAsync($"window.alert(\"{message}\");");
    }

    private void OnLoadingStateChanged(object sender, LoadingStateChangedEventArgs e)
    {
        if (e.IsLoading) return;
        if (_address == Browser.Address) return;
        _address = Browser.Address;
        
        UrlLoaded?.Invoke(this, Browser.Address);
        
        if (_initialized) return;
        _initialized = true;

        Task.Factory.StartNew(() => 
            InitialLoad?.Invoke(this, EventArgs.Empty));
    }
}