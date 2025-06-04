using Microsoft.Extensions.Caching.Memory;
using Tradeplus.Service.Model;

namespace Tradeplus.Service.Repository.ManageSecurity
{
  
    public class MemoryCacheSecurityRepository : ISecurityRepository
    {
      private readonly IMemoryCache _cache;
      private const string CacheKeyPrefix = "Security_";

      public MemoryCacheSecurityRepository(IMemoryCache cache)
      {
        _cache = cache;
      }

      public AddSecurityRequest AddSecurity(AddSecurityRequest security)
      {
        var key = CacheKeyPrefix + security.Symbol;
        // Check if the security already exists in the cache.
        if (_cache.TryGetValue(key, out AddSecurityRequest existingSecurity))
        {
          // Return null or throw an exception if already exists.
          return null;
        }

        // Add the new security to the cache.
        _cache.Set(key, security);
        return security;
      }

      public AddSecurityRequest GetSecurity(string symbol)
      {
        var key = CacheKeyPrefix + symbol.ToUpper();
        _cache.TryGetValue(key, out AddSecurityRequest security);
        return security;
      }
    }
  

}
