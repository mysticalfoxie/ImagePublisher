using Microsoft.AspNetCore.SignalR;

namespace ImagePublisher.Web.Host.WebSockets;

public class WebSocket : Hub
{
    private readonly ILogger<WebSocket> _logger;

    public WebSocket(ILogger<WebSocket> logger)
    {
        _logger = logger;
    }
    
    public override Task OnConnectedAsync()
    {
        _logger.LogDebug($"[{Context.ConnectionId}] new client connected");
        return Task.CompletedTask;
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        _logger.LogDebug($"[{Context.ConnectionId}] client disconnected");
        return Task.CompletedTask;
    }
}