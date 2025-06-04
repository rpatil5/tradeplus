using System.Collections.Generic;

namespace Tradeplus.Service.Model
{
  
    public class SecurityRequest : RequestBase
  {
      public List<string> Symbols { get; set; }
    }

}
