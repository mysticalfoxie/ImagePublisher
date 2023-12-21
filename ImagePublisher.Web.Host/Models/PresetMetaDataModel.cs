namespace ImagePublisher.Web.Host.Models;

public class PresetMetaDataModel
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int TagCount { get; set; }
    public string PreviewImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}