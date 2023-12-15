using System;

namespace ImagePublisher.Web.Host.Middleware;

public class IndexFileMiddleware : IMiddleware
{
    private static byte[] _indexFileContents;
    
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (context.GetEndpoint() is null && 
            context.Request.Method == "GET" &&
            context.Request.Headers.Accept.Any(x => x.Contains("text/html")))
            await RespondWithIndexFile(context);
        else
            await next(context);
    }

    private async Task RespondWithIndexFile(HttpContext context)
    {
        _indexFileContents ??= await ReadIndexFile();

        context.Response.ContentType = "text/html";
        context.Response.Headers.ContentDisposition = "inline";
        context.Response.StatusCode = 200;
        await context.Response.Body.WriteAsync(_indexFileContents);
    }

    private async Task<byte[]> ReadIndexFile()
    {
        var assembly = GetType().Assembly;
        var assemblyFile = new FileInfo(assembly.Location);
        var root = Directory.GetParent(assemblyFile.FullName);
        var wwwroot = Path.Combine(root!.FullName, "wwwroot");
        var filepath = Path.Combine(wwwroot, "index.html");
        return await File.ReadAllBytesAsync(filepath);
    }
}