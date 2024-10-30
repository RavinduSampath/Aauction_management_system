using api.Data;
using api.Dtos.Dashboard;
using api.Mappers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class Dashboard : ControllerBase
    {
        private readonly APIContext _context;
        public Dashboard(APIContext context) {
            _context = context;
        }
        [HttpPost]
        [Route("all")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetDashboardData([FromBody] GetDashboardDto dashboardDto)
        {
            var user = _context.Users.FirstOrDefault(x => x.UserId == dashboardDto.UserId);
            if (user == null)
            {
                var errorResponse = new {
                    success = false,
                    message = "UserNotFound"
                };
                return NotFound(errorResponse);
            }
            
            // Auction Overview table (Latest 10 auctions with bid count)
            var auctionOverview = _context.Auctions.Where(x => x.SellerId == dashboardDto.UserId).OrderByDescending(x => x.AuctionId).Take(10)
            .Select(auction => new {
                    Auction = auction,
                    BidCount = _context.Bids.Count(b => b.AuctionId == auction.AuctionId)
            }).ToList();


            // dashboard counts
            var activeAuctionIds = _context.Auctions
    .Where(x => x.SellerId == dashboardDto.UserId && x.Status == "active" && x.WinnerId == null)
    .Select(x => x.AuctionId)
    .ToList();

            var totalActiveBids = _context.Bids
                .Count(b => activeAuctionIds.Contains(b.AuctionId));


            var totalAuctions = _context.Auctions.Count(x => x.SellerId == dashboardDto.UserId);
            var activeAuctions = _context.Auctions.Count(x => x.SellerId == dashboardDto.UserId && x.Status == "active");
            var closedAuctions = _context.Auctions.Count(x => x.SellerId == dashboardDto.UserId && x.Status == "closed");
            var liveAuctions = _context.Auctions.Count(x => x.SellerId == dashboardDto.UserId && x.IsLive == "yes");
            var removedFromLiveAuctions = _context.Auctions.Count(x => x.SellerId == dashboardDto.UserId && x.IsLive == "no");

            // Step 1: Get the bid amounts for each closed auction with a winner
            var winningBidAmounts = _context.Auctions
                .Where(x => x.SellerId == dashboardDto.UserId && x.Status == "closed" && x.WinnerId != null)
                .Select(auction => _context.Bids
                    .Where(b => b.AuctionId == auction.AuctionId && b.BidderId == auction.WinnerId && b.Status == "paid")
                    .Select(b => b.BidAmount)
                    .FirstOrDefault())
                .ToList();

            // Step 2: Sum the winning bid amounts
            var totalAuctionIncome = winningBidAmounts.Sum();

            var completedAuctions = _context.Auctions.Count(x => x.SellerId == dashboardDto.UserId && x.Status == "closed" && x.WinnerId != null);

            
            // paid auctions table
            var paidAuctions = _context.Auctions
                .Where(x => x.SellerId == dashboardDto.UserId && x.Status == "closed" && x.WinnerId != null)
                .Select(auction => new
                {
                    Auction = auction.ToAuctionsDtoGet(),
                    WinningBid = _context.Bids.FirstOrDefault(b => b.AuctionId == auction.AuctionId && b.BidderId == auction.WinnerId && b.Status == "paid")
                })
                .Where(item => item.WinningBid != null) // Filter out auctions with no "paid" winning bid
                .ToList();

            // Activities table
            var activities = _context.Notifications.Where(x => x.UserId == dashboardDto.UserId).OrderByDescending(x => x.Id).Take(5).ToList();
            
            // pie chart 2
            var auctionCategories = _context.Auctions
                .Where(x => x.SellerId == dashboardDto.UserId) // Filter by UserId
                .GroupBy(x => x.AuctionCategory)
                .Select(group => new
                {
                    Category = group.Key,
                    Count = group.Count()
                })
                .ToList();
            
            // pie chart 1
            var auctionTrends = _context.Auctions
                .GroupBy(x => x.AuctionCategory)
                .Select(group => new
                {
                    Category = group.Key,
                    Count = group.Count()
                })
                .ToList();




            var successResponse = new {
                success = true,
                message = "ok",
                data = new {
                    auctions = new {
                        totalAuctions = totalAuctions,
                        activeAuctions = activeAuctions,
                        closedAuctions = closedAuctions,
                        liveAuctions = liveAuctions,
                        removedFromLiveAuctions = removedFromLiveAuctions
                    },
                    dash = new {
                        activeBids = totalActiveBids,
                        totalAuctionIncome = totalAuctionIncome,
                        completedAuctions = completedAuctions,
                    },
                    tables = new {
                        auctionOverview = auctionOverview,
                        paidAuctions = paidAuctions,
                        activities = activities
                    },
                    charts = new {
                        auctionCategories = auctionCategories,
                        auctionTrends = auctionTrends
                    }
                }
                
            };
            return Ok(successResponse);
        }
    }
}
