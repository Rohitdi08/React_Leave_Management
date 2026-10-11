using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Auth1.Migrations
{
    /// <inheritdoc />
    public partial class IntialAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Refreshes",
                table: "Refreshes");

            migrationBuilder.RenameTable(
                name: "Refreshes",
                newName: "Refresh");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Refresh",
                table: "Refresh",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Refresh",
                table: "Refresh");

            migrationBuilder.RenameTable(
                name: "Refresh",
                newName: "Refreshes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Refreshes",
                table: "Refreshes",
                column: "Id");
        }
    }
}
