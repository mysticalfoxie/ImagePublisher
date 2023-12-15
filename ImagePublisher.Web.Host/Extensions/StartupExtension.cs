using ImagePublisher.Web.Host.Middleware;
using Microsoft.Extensions.FileProviders;

namespace ImagePublisher.Web.Host.Extensions;

public static class StartupExtension
{
    public static void AddSinglePageApplication(this WebApplication app)
    {
        app.UseMiddleware<IndexFileMiddleware>();
        app.UseMiddleware<StaticRootFilesMiddleware>();
    }

    public static void AddSinglePageApplication(this IServiceCollection services)
    {
        services.AddTransient<IndexFileMiddleware>();
        services.AddTransient<StaticRootFilesMiddleware>();
    }
    
    public static void AddStaticAssets(this WebApplication app)
    {
        var directory = new DirectoryInfo("wwwroot/assets");
        var provider = new PhysicalFileProvider(directory.FullName);
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = provider,
            RequestPath = "/assets"
        });
    }
}