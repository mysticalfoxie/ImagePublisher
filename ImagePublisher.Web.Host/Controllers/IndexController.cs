using Microsoft.AspNetCore.Mvc;

namespace ImagePublisher.Web.Host.Controllers;

[Route("/")]
[ApiController]
public class IndexController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Redirect("/index.html");
    }
}