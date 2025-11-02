using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace {{name}}
{
    /// <summary>
    /// Main program entry point.
    /// </summary>
    class Program
    {
        static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            await host.RunAsync();
        }

        static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.AddConsole();
                })
                .ConfigureServices((context, services) =>
                {
                    services.AddHostedService<{{Name}}Service>();
                });
    }

    /// <summary>
    /// Main service following architectural discipline principles.
    /// </summary>
    public class {{Name}}Service : BackgroundService
    {
        private readonly ILogger<{{Name}}Service> _logger;

        public {{Name}}Service(ILogger<{{Name}}Service> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("{{name}} service starting...");

            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    _logger.LogInformation("Processing at: {Time}", DateTimeOffset.Now);
                    await ProcessAsync(stoppingToken);
                    await Task.Delay(5000, stoppingToken);
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("{{name}} service is stopping...");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in {{name}} service");
                throw;
            }
        }

        private async Task ProcessAsync(CancellationToken cancellationToken)
        {
            // Main processing logic here
            _logger.LogDebug("Processing...");
            await Task.Delay(100, cancellationToken);
        }
    }
}

