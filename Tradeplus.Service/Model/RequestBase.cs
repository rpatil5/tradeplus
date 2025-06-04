namespace Tradeplus.Service.Model
{
  public class RequestBase
  {
    public string UserId { get; set; }
    public string RequestId { get; set; } // This will be used for logging and tracing a request
    public string RequestType { get; set; }
  }
}
