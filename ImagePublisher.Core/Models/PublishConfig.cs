using ImagePublisher.DeviantArt;

namespace ImagePublisher.Models;

public class PublishConfig
{
    public string Image { get; set; }
    public DAPublishConfig DeviantArt { get; set; } 
}