using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tradeplus.Service.Model;
using Tradeplus.Service.Repository.ManageSecurity;

namespace Tradeplus.Service.Controllers
{

  [Route("api/[controller]")]
  [ApiController]
  public class SecurityController : ControllerBase
  {
    private readonly ISecurityRepository _repository;

    public SecurityController(ISecurityRepository repository)
    {
      _repository = repository;
    }

    /// <summary>
    /// Adds a new security.  
    /// Validates that the symbol is provided and checks if it already exists.
    /// </summary>
    /// <param name="security">Security details sent in the request body.</param>
    /// <returns>JSON containing the security or an error message.</returns>
    [HttpPost("command/v1/add")]
    public IActionResult AddSecurity([FromBody] List<AddSecurityRequest> securities)
    {
      if (securities == null || !securities.Any())
      {
        return BadRequest("At least one security is required.");
      }

      var addedSecurities = new List<AddSecurityRequest>();
      var conflictingSymbols = new List<string>();

      foreach (var security in securities)
      {
        if (string.IsNullOrWhiteSpace(security.Symbol))
        {
          return BadRequest($"Security symbol is required for all entries.");
        }

        // Validate if this security already exists
        var existingSecurity = _repository.GetSecurity(security.Symbol);
        if (existingSecurity != null)
        {
          conflictingSymbols.Add(security.Symbol);
          continue; // Skip adding duplicate entries
        }

        var newSecurity = new AddSecurityRequest
        {
          Symbol = security.Symbol,
          Description = security.Description,
          Price = security.Price
        };

        var addedSecurity = _repository.AddSecurity(newSecurity);
        if (addedSecurity != null)
        {
          addedSecurities.Add(addedSecurity);
        }
      }

      if (conflictingSymbols.Any())
      {
        return Conflict(new
        {
          Message = $"The following securities already exist: {string.Join(", ", conflictingSymbols)}",
          ExistingSymbols = conflictingSymbols,
          AddedSecurities = addedSecurities
        });
      }

      return Ok(addedSecurities);
    }



    /// <summary>
    /// Retrieves multiple securities based on symbols provided in the request body.
    /// </summary>
    [HttpPost("get")]
    public IActionResult GetSecurities([FromBody] SecurityRequest request)
    {
      if (request == null || request.Symbols == null || !request.Symbols.Any())
      {
        return BadRequest("At least one security symbol is required.");
      }

      var foundSecurities = new List<AddSecurityRequest>();
      var missingSymbols = new List<string>();

      foreach (var symbol in request.Symbols)
      {
        var security = _repository.GetSecurity(symbol);
        if (security != null)
        {
          foundSecurities.Add(security);
        }
        else
        {
          missingSymbols.Add(symbol);
        }
      }

      if (!foundSecurities.Any())
      {
        return NotFound($"No securities found for symbols: {string.Join(", ", missingSymbols)}");
      }

      return Ok(new { foundSecurities, missingSymbols });


    }
  }

}
