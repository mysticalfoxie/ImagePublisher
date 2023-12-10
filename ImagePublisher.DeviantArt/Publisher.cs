using ImagePublisher.Core.Interfaces;
using ImagePublisher.Core.Models;
using ImagePublisher.Core.Utils;

namespace ImagePublisher.DeviantArt;

public class Publisher : IPublisher
{
    public async Task Publish(PublishContext context)
    {
        await PublishImage(context);
        await AddTagsToPost(context);
        // Browser.Open($"https://www.deviantart.com/deviation/edit/{publish.DeviationId}");
    }

    public static async Task PublishImage(PublishContext context)
    {
        Log.Write("[Started: Upload image to DeviantArt via API]");
        using var client = new DAApiService();
        await client.LoginAsync();
        var stash = await client.UploadToStash(context.Image);
        var opts = GetPublishRequestDataForItem(stash.ItemId);
        var publish = await client.PublishStashItem(opts);
        context.DeviationUrl = publish.Url;
        context.DeviationId = publish.DeviationId;
        Log.Write("[@gCompleted@r: Upload image to DeviantArt via API]");
    }

    public static async Task AddTagsToPost(PublishContext context)
    {
        if (context.Config.DeviantArt.Tags is null)
        {
            Log.Write("Adding tags to deviation... @dSkipped.");
            return;
        }

        Log.Write("[Started: Adding tags to deviation]");
        using var service = new DAWebPageService(context);
        await service.AddTagsToPost(context);
        Log.Write("[@gCompleted@r: Adding tags to deviation]");
    }

    private static PublishRequestData GetPublishRequestDataForItem(long itemId)
    {
        return new PublishRequestData
        {
            ItemId = itemId,
            AgreeSubmission = true,
            AgreeTos = true,
            AllowComments = true,
            AllowFreeDownload = true,
            IsMatureContent = false
        };
    }
}