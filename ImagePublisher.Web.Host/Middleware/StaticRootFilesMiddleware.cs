using System.Collections.Concurrent;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.StaticFiles;

namespace ImagePublisher.Web.Host.Middleware;

public class StaticRootFilesMiddleware : IMiddleware
{
    private static readonly Regex RootFilePathRegex = new(@"^/(.*\.\w+)$");
    private static readonly ConcurrentDictionary<string, byte[]> RootFiles = new();
    private static readonly FileExtensionContentTypeProvider FileTypeProvider = new();
    
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (context.GetEndpoint() is null && 
            context.Request.Method == "GET" &&
            RootFilePathRegex.IsMatch(context.Request.Path) &&
            !context.Request.Headers.Accept.Any(x => x.Contains("text/html")))
            await RespondWithRootFile(context, next);
        else
            await next(context);
    }

    private async Task RespondWithRootFile(HttpContext context, RequestDelegate next)
    {
        if (!TryGetFileFromPath(context, out var file))
        {
            await next(context);
            return;
        }

        if (!FileTypeProvider.TryGetContentType(file.Extension, out var mimeType))
        {
            await next(context);
            return;
        }

        if (!context.Request.Headers.Accept.Any(x => x.Contains(mimeType)) 
            && context.Request.Headers.Accept.All(x => x != "*/*"))
        {
            await next(context);
            return;
        }

        var data = await GetRootFileFromCache(file);
        context.Response.ContentType = mimeType;
        context.Response.StatusCode = 200;
        await context.Response.Body.WriteAsync(data);
    }

    private static async Task<byte[]> GetRootFileFromCache(FileInfo file)
    {
        byte[] data = null;
        if (!RootFiles.ContainsKey(file.Name))
        {
            data = await File.ReadAllBytesAsync("wwwroot/index.html");

            var retries = 0;
            while (!RootFiles.TryAdd(file.Name, data) && ++retries < 3)
                await Task.Delay(200);
        }

        data ??= RootFiles[file.Name];
        return data;
    }

    private bool TryGetFileFromPath(HttpContext context, out FileInfo file)
    {
        var match = RootFilePathRegex.Match(context.Request.Path);
        var filename = match.Groups[1].Value;
        var assembly = GetType().Assembly;
        var assemblyFile = new FileInfo(assembly.Location);
        var root = Directory.GetParent(assemblyFile.FullName);
        var wwwroot = Path.Combine(root!.FullName, "wwwroot");
        var filepath = Path.Combine(wwwroot, filename);
        file = new FileInfo(filepath);
        return file.Exists;
    }
}