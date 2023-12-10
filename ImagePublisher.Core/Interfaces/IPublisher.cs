using ImagePublisher.Core.Models;

namespace ImagePublisher.Core.Interfaces;

public interface IPublisher
{
    public Task Publish(PublishContext context);
}