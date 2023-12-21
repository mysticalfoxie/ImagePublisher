using ImagePublisher.Web.Host.Interfaces;
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

    public static void AddServices(this IServiceCollection collection)
    {
        var assembly = typeof(Program).Assembly;
        var serviceType = typeof(IService);
        var services = assembly
            .GetTypes()
            .Where(x => x.IsAssignableTo(serviceType))
            .Where(x => x.IsClass);
        
        foreach (var service in services)
            collection.AddSingleton(service);
    }

    public static void AddCorsPolicy(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder.WithOrigins("http://localhost:4200");
                builder.AllowAnyHeader();
                builder.AllowAnyMethod();
            });
        });
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