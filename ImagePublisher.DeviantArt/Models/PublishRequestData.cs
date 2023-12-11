namespace ImagePublisher.DeviantArt;

public class PublishRequestData
{
    public bool IsMatureContent { get; init; }
    public bool AgreeTos { get; init; }
    public bool AgreeSubmission { get; init; }
    public bool AllowComments { get; init; }
    public bool AllowFreeDownload { get; init; }
    public long ItemId { get; init; }
}