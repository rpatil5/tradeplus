namespace Tradeplus.Service.Model
{
    public class AddSecurityRequest 
  {
      public string Symbol { get; set; }          // Unique identifier
      public string Description { get; set; }
      public decimal Price { get; set; }
    }  

}
