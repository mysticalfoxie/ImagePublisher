namespace ImagePublisher.DeviantArt;

public class PublishRequestData
{
    public bool IsMatureContent { get; set; }
    public bool AgreeTos { get; set; }
    public bool AgreeSubmission { get; set; }
    public bool AllowComments { get; set; }
    public bool AllowFreeDownload { get; set; }
    public long ItemId { get; set; }
}