using ImagePublisher.Web.Host.WebSockets;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseStaticFiles();
app.MapControllers();
app.MapHub<WebSocket>("/websocket");
app.Run();