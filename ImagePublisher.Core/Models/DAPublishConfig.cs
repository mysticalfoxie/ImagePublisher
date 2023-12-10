namespace ImagePublisher.DeviantArt;

public class DAPublishConfig
{
    public bool Enabled { get; set; }
    public string[] Tags { get; set; }
    public bool PublishToStash { get; set; }
    public bool StashItemId { get; set; }
}