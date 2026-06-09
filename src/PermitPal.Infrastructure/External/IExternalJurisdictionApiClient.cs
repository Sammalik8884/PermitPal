using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using PermitPal.Domain.Entities;

namespace PermitPal.Infrastructure.External;

public interface IExternalJurisdictionApiClient
{
    /// <summary>
    /// Fetches the latest jurisdiction rules from the external compliance data provider.
    /// </summary>
    Task<IEnumerable<Jurisdiction>> FetchLatestJurisdictionsAsync(CancellationToken cancellationToken = default);
}
