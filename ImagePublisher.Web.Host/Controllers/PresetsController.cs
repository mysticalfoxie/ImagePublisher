using ImagePublisher.Web.Host.Models;
using ImagePublisher.Web.Host.Parsers;
using ImagePublisher.Web.Host.Services;
using ImagePublisher.Web.Host.Validators;
using Microsoft.AspNetCore.Mvc;

// ReSharper disable RouteTemplates.ActionRoutePrefixCanBeExtractedToControllerRoute

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

    [HttpGet]
    public IActionResult GetAllPresets()
    {
        return Ok(_service.GetAllPresets());
    }

    [HttpGet("{id:Guid}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id)
    {
        if (!_service.FindPresetFileById(id, out var file, out var error))
            return error;

        var content = await PresetsService.LoadPresetFromFile(file);
        _service.SetImageUrls(content, HttpContext.Request);
        
        return Ok(content);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] PresetFormData form)
    {
        if (string.IsNullOrWhiteSpace(form?.Json)) return BadRequest("The Form data is missing the json property.");
        if (!form.TryParse(out var model, out var parsingError)) return parsingError;
        if (!form.IsValid(model, out var validationError)) return validationError;
        var metadata = await _service.AddPreset(form, model, HttpContext.Request);
        return Ok(metadata);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromForm] PresetFormData form)
    {
        if (string.IsNullOrWhiteSpace(form?.Json)) return BadRequest("The Form data is missing the json property.");
        if (!form.TryParse(out var model, out var parsingError)) return parsingError;
        if (!form.IsValid(model, out var validationError)) return validationError;
        if (!_service.FindPresetFileById(model.Id.GetValueOrDefault(), out var file, out var error))
            return error;
        var metadata = await _service.UpdatePreset(form, model, file, HttpContext.Request);
        return Ok(metadata);
    }

    [HttpGet("{id:Guid}/thumbnail")]
    public IActionResult GetThumbnail([FromRoute] Guid id)
    {
        if (!_service.TryOpenThumbnailStream(id, out var stream, out var error))
            return error;
        return Ok(stream);
    }

    [HttpGet("{id:Guid}/hd-image")]
    public IActionResult GetHDImage([FromRoute] Guid id)
    {
        if (!_service.TryOpenHDImageStream(id, out var stream, out var error))
            return error;
        return Ok(stream);
    }

    [HttpGet("{id:Guid}/ld-image")]
    public IActionResult GetLDImage([FromRoute] Guid id)
    {
        if (!_service.TryOpenLDImageStream(id, out var stream, out var error))
            return error;
        return Ok(stream);
    }

    [HttpGet("{id:Guid}/image")]
    public IActionResult GetImage([FromRoute] Guid id)
    {
        if (!_service.TryOpenImageStream(id, out var stream, out var error))
            return error;
        return Ok(stream);
    }
}