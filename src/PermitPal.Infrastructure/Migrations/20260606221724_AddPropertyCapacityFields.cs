using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PermitPal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertyCapacityFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BathroomCount",
                table: "properties",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "BedroomCount",
                table: "properties",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaxGuests",
                table: "properties",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BathroomCount",
                table: "properties");

            migrationBuilder.DropColumn(
                name: "BedroomCount",
                table: "properties");

            migrationBuilder.DropColumn(
                name: "MaxGuests",
                table: "properties");
        }
    }
}
