using ImagePublisher.Web.Host.Models;
using ImagePublisher.Web.Host.Parsers;
using ImagePublisher.Web.Host.Services;
using ImagePublisher.Web.Host.Validators;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace ImagePublisher.Web.Host.Controllers;

[ApiController]
[Route("/api/presets")]
public class PresetsController : ControllerBase
{
    private readonly PresetsService _service;

    public PresetsController(
        PresetsService service)
    {
        _service = service;
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] PresetFormData form)
    {
        if (string.IsNullOrWhiteSpace(form?.Json)) return BadRequest("The Form data is missing the json property.");
        if (!form.TryParse(out var model, out var parsingError)) return parsingError;
        if (!form.IsValid(model, out var validationError)) return validationError;
        var metadata = await _service.AddPreset(form, model);
        metadata.PreviewImageUrl = HttpContext.Request.GetDisplayUrl() + $"/{metadata.Id}/thumbnail";
        return Ok(metadata);
    }

    [HttpGet("{id:Guid}/thumbnail")]
    public IActionResult GetThumbnail([FromRoute] Guid id)
    {
        if (!_service.TryOpenThumbnailStream(id, out var stream, out var error))
            return error;
        return Ok(stream);
    }
}