using ImagePublisher.Web.Host.Models;
using Microsoft.AspNetCore.Mvc;

namespace ImagePublisher.Web.Host.Validators;

public static class PresetModelValidator
{
    public static bool IsValid(this PresetFormData form, PresetModel model, out IActionResult result)
    {
        result = InternalValdiate(model, form);
        return result == null;
    }

    private static IActionResult InternalValdiate(PresetModel model, PresetFormData form)
    {
        if (model.General is null) return new BadRequestObjectResult("The preset is missing the general section");
        if (string.IsNullOrWhiteSpace(model.General.Title)) return new BadRequestObjectResult("The preset is missing a title");

        if (model.DeviantArt is null &&
            model.Facebook is null &&
            model.Instagram is null &&
            model.Pinterest is null)
            return new BadRequestObjectResult("At least one publishing section has to be defined.");

        if (model.General.UseHDLDImages)
        {
            if (!IsSupportedContentType(form.HDImage.ContentType))
                return new BadRequestObjectResult("The content type of the HD image is not supported. Only jpg, jpeg and png is supported.");
            if (!IsSupportedContentType(form.LDImage.ContentType))
                return new BadRequestObjectResult("The content type of the LD image is not supported. Only jpg, jpeg and png is supported.");
        }
        else
        {
            if (!IsSupportedContentType(form.Image.ContentType))
                return new BadRequestObjectResult("The content type of the image is not supported. Only jpg, jpeg and png is supported.");
        }

        return null;
    }

    private static bool IsSupportedContentType(string contentType)
    {
        switch (contentType)
        {
            case "image/png":
            case "image/jpg":
            case "image/jpeg":
                return true;
            default:
                return false;
        }
    }
}