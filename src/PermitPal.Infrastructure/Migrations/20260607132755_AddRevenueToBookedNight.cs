using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PermitPal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRevenueToBookedNight : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GrossRevenueCents",
                table: "booked_nights",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PlatformFeeCents",
                table: "booked_nights",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GrossRevenueCents",
                table: "booked_nights");

            migrationBuilder.DropColumn(
                name: "PlatformFeeCents",
                table: "booked_nights");
        }
    }
}
