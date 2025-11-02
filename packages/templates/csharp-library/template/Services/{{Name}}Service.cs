using Microsoft.Extensions.Logging;

namespace {{name}}.Services
{
    /// <summary>
    /// Service class following architectural discipline principles.
    /// </summary>
    public class {{Name}}Service
    {
        private readonly ILogger<{{Name}}Service> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="{{Name}}Service"/> class.
        /// </summary>
        /// <param name="logger">The logger instance.</param>
        public {{Name}}Service(ILogger<{{Name}}Service> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gets data asynchronously.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns>A task representing the async operation with the result.</returns>
        public async Task<string?> GetDataAsync(int id)
        {
            _logger.LogInformation("Getting data for ID: {Id}", id);

            try
            {
                // Core logic here
                await Task.Delay(100); // Simulate async operation
                return $"Data for ID: {id}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting data for ID: {Id}", id);
                throw;
            }
        }

        /// <summary>
        /// Creates new data.
        /// </summary>
        /// <param name="data">The data to create.</param>
        /// <returns>The created data identifier.</returns>
        public int CreateData(string data)
        {
            if (string.IsNullOrWhiteSpace(data))
            {
                throw new ArgumentException("Data cannot be null or empty", nameof(data));
            }

            _logger.LogInformation("Creating data: {Data}", data);

            // Core logic here
            var id = new Random().Next(1, 1000);
            return id;
        }
    }
}

