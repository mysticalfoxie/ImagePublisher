using ImagePublisher.Core.Interfaces;
using ImagePublisher.Core.Models;
using ImagePublisher.Core.Utils;

namespace ImagePublisher.DeviantArt;

public class Publisher : IPublisher
{
    public async Task Publish(PublishContext context)
    {
        await PublishImage(context);
        AddTagsToPost(context);
    }

    public static async Task PublishImage(PublishContext context)
    {
        if (context.Config.DeviantArt.SkipStashUpload.GetValueOrDefault() &&
            context.Config.DeviantArt.SkipPublish.GetValueOrDefault() &&
            context.Config.DeviantArt.AddTags.GetValueOrDefault())
        {
            if (string.IsNullOrWhiteSpace(context.Config.DeviantArt.DeviationId))
                throw new InvalidOperationException("Cannot skip the DeviantArt image publish when there is no DeviationId.");
            
            Log.Write("Publishing image to DeviantArt via API... @dSkipped!");
            return;
        }

        Log.Write("[Started: Publishing image to DeviantArt via API]");
        using var client = new DAApiService();
        await client.LoginAsync();
        var stash = await client.UploadToStash(context);
        var opts = GetPublishRequestDataForItem(stash.ItemId);
        await client.PublishStashItem(context, opts);
        Log.Write("[@gCompleted@r: Publishing image to DeviantArt via API]");
    }

    public static void AddTagsToPost(PublishContext context)
    {
        if (!context.Config.DeviantArt.AddTags.HasValue ||
            context.Config.DeviantArt.AddTags.Value == false ||
            string.IsNullOrWhiteSpace(context.Config.DeviantArt.Tags))
        {
            Log.Write("Adding tags to deviation... @dSkipped.");
            return;
        }

        Log.Write("[Started: Adding tags to deviation]");
        using var service = new DAWebPageService(context);
        service.AddTagsToPost();
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