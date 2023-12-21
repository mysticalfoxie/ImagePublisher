using ImagePublisher.Web.Host.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ImagePublisher.Web.Host.Parsers;

public static class PresetModelParser
{
    public static bool TryParse(this PresetFormData form, out PresetModel model, out IActionResult error)
    {
        try
        {
            model = JsonConvert.DeserializeObject<PresetModel>(form.Json);
            error = null;
            return true;
        }
        catch (Exception ex)
        {
            model = null;
            error = new BadRequestObjectResult($"Cannot parse the json property to a preset model. {ex.Message}");
            return false;
        }
    }
}