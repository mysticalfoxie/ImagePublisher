using ImagePublisher.Browser;
using ImagePublisher.Core.Utils;
using Microsoft.AspNetCore.Mvc;

namespace ImagePublisher.Web.Host.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TestController : ControllerBase
{
    public IActionResult Get()
    {
        Task.Factory.StartNew(() =>
        {
            try
            {
                using var emulator = new BrowserEmulator();
                emulator.Start();
                emulator.Navigate("https://deviantart.com/naughtyfoxie");
                while (!emulator.Browser.IsDisposed)
                {
                }
            }
            catch (Exception ex)
            {
                Log.Write("@r" + ex.Message);
                Console.WriteLine(ex);
            }
        });
        
        return Ok("Started Browser.");
    }
}