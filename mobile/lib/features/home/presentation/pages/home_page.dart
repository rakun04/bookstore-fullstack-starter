import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

import '../../../core/widgets/loading_widget.dart';
import '../../../core/widgets/error_widget.dart';
import '../providers/home_provider.dart';
import '../widgets/book_card.dart';
import '../widgets/banner_slider.dart';
import '../widgets/category_grid.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    // Load data when page initializes
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(homeProvider.notifier).loadHomeData();
    });
  }

  @override
  Widget build(BuildContext context) {
    final homeState = ref.watch(homeProvider);

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            ref.read(homeProvider.notifier).refreshHomeData();
          },
          child: CustomScrollView(
            controller: _scrollController,
            slivers: [
              // App Bar
              SliverAppBar(
                floating: true,
                backgroundColor: Colors.white,
                elevation: 0,
                title: Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: TextField(
                          onTap: () {
                            // Navigate to search page
                          },
                          readOnly: true,
                          decoration: const InputDecoration(
                            hintText: 'Cari buku favorit kamu...',
                            prefixIcon: Icon(Icons.search),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 10,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    IconButton(
                      onPressed: () {
                        // Navigate to cart
                      },
                      icon: Badge(
                        label: Text(homeState.cartCount.toString()),
                        child: const Icon(Icons.shopping_cart_outlined),
                      ),
                    ),
                    IconButton(
                      onPressed: () {
                        // Navigate to notifications
                      },
                      icon: Badge(
                        label: Text(homeState.notificationCount.toString()),
                        child: const Icon(Icons.notifications_outlined),
                      ),
                    ),
                  ],
                ),
              ),

              // Content
              SliverToBoxAdapter(
                child: homeState.when(
                  data: (data) => _buildContent(context, data),
                  loading: () => const LoadingWidget(),
                  error: (error, stack) => CustomErrorWidget(
                    error: error.toString(),
                    onRetry: () {
                      ref.read(homeProvider.notifier).loadHomeData();
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContent(BuildContext context, dynamic homeData) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Banner Slider
        BannerSlider(banners: homeData.banners),

        const SizedBox(height: 24),

        // Categories
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Kategori',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              CategoryGrid(categories: homeData.categories),
            ],
          ),
        ),

        const SizedBox(height: 24),

        // Flash Sale
        if (homeData.flashSale != null) ...[
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.red[400]!, Colors.orange[400]!],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.flash_on, color: Colors.white),
                const SizedBox(width: 8),
                const Text(
                  'Flash Sale',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
                const Spacer(),
                // Countdown Timer
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '23:59:45',
                    style: TextStyle(
                      color: Colors.red[600],
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 200,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: homeData.flashSale.books.length,
              itemBuilder: (context, index) {
                final book = homeData.flashSale.books[index];
                return BookCard(
                  book: book,
                  width: 120,
                  showDiscount: true,
                  originalPrice: book.originalPrice,
                );
              },
            ),
          ),
          const SizedBox(height: 24),
        ],

        // Featured Books
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Buku Terlaris',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      // Navigate to all books
                    },
                    child: const Text('Lihat Semua'),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.65,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: homeData.featuredBooks.take(6).length,
                itemBuilder: (context, index) {
                  final book = homeData.featuredBooks[index];
                  return BookCard(book: book);
                },
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),

        // Recent Books
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Buku Terbaru',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      // Navigate to all books
                    },
                    child: const Text('Lihat Semua'),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.65,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                itemCount: homeData.recentBooks.take(6).length,
                itemBuilder: (context, index) {
                  final book = homeData.recentBooks[index];
                  return BookCard(book: book);
                },
              ),
            ],
          ),
        ),

        const SizedBox(height: 100), // Bottom padding for navigation
      ],
    );
  }
}