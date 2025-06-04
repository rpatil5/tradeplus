using Tradeplus.Service.Model;

namespace Tradeplus.Service.Repository.ManageSecurity
{

    public interface ISecurityRepository
    {
      /// <summary>
      /// Adds a security if it does not already exist.
      /// Returns the added security if successful; otherwise, null.
      /// </summary>
      AddSecurityRequest AddSecurity(AddSecurityRequest security);

      /// <summary>
      /// Retrieves a security by symbol.
      /// </summary>
      AddSecurityRequest GetSecurity(string symbol);
    }
  

}
