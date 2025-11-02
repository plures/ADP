namespace {{name}}.Utils
{
    /// <summary>
    /// Helper class for validation operations.
    /// </summary>
    public static class ValidationHelper
    {
        /// <summary>
        /// Validates if a string is not null or empty.
        /// </summary>
        /// <param name="value">The value to validate.</param>
        /// <param name="parameterName">The name of the parameter.</param>
        /// <exception cref="ArgumentException">Thrown when validation fails.</exception>
        public static void ValidateNotNullOrEmpty(string? value, string parameterName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException($"{parameterName} cannot be null or empty", parameterName);
            }
        }

        /// <summary>
        /// Validates if a value is within a specified range.
        /// </summary>
        /// <param name="value">The value to validate.</param>
        /// <param name="min">The minimum value.</param>
        /// <param name="max">The maximum value.</param>
        /// <param name="parameterName">The name of the parameter.</param>
        /// <exception cref="ArgumentOutOfRangeException">Thrown when validation fails.</exception>
        public static void ValidateRange(int value, int min, int max, string parameterName)
        {
            if (value < min || value > max)
            {
                throw new ArgumentOutOfRangeException(
                    parameterName,
                    $"{parameterName} must be between {min} and {max}"
                );
            }
        }
    }
}

