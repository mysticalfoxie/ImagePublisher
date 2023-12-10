using ImagePublisher.Models;

namespace ImagePublisher.Core.Models;

public class PublishContext
{
    public PublishContext(FileInfo image, PublishConfig config)
    {
        Config = config;
        Image = image;
    }
    
    public PublishConfig Config { get; }
    public FileInfo Image { get; }
    public string DeviationUrl { get; set; }
    public string DeviationId { get; set; }
}