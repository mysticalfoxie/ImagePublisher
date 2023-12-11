using CefSharp.WinForms;

namespace ImagePublisher.Browser;

partial class MainForm
{
    private System.ComponentModel.IContainer components = null;
    private ChromiumWebBrowser _browser;

    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null)) 
            components.Dispose();

        base.Dispose(disposing);
    }

    private void InitializeComponent()
    {
        _wrapper = new Panel();
        _browser = new ChromiumWebBrowser();
        SuspendLayout();
        // 
        // _wrapper
        // 
        _wrapper.Dock = DockStyle.Fill;
        _wrapper.Location = new Point(0, 0);
        _wrapper.Name = "_wrapper";
        _wrapper.Size = new Size(917, 479);
        _wrapper.TabIndex = 0;
        // 
        // _browser
        // 
        _browser.ActivateBrowserOnCreation = false;
        _browser.Dock = DockStyle.Fill;
        _browser.Location = new Point(0, 0);
        _browser.Name = "_browser";
        _browser.Size = new Size(917, 479);
        _browser.TabIndex = 0;
        // 
        // MainForm
        // 
        AutoScaleDimensions = new SizeF(7F, 15F);
        AutoScaleMode = AutoScaleMode.Font;
        ClientSize = new Size(1600, 900);
        Controls.Add(_browser);
        Controls.Add(_wrapper);
        Name = "MainForm";
        Text = "Emulated Browser";
        ResumeLayout(false);
    }

    private Panel _wrapper;
}