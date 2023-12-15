using ImagePublisher.Web.Host.Extensions;
using ImagePublisher.Web.Host.WebSockets;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddControllers();
builder.Services.AddSinglePageApplication();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.AddStaticAssets();
app.AddSinglePageApplication();
app.MapHub<WebSocket>("/websocket");
app.MapControllers();
app.Run();