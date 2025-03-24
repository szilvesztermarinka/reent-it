function createUserProfile(savedPosts, viewedPosts) {
    const profile = {};

    const allPosts = [...savedPosts, ...viewedPosts];

    allPosts.forEach((post) => {
        Object.keys(post).forEach((key) => {
            if (key === "id") return;

            if (!profile[key]) {
                profile[key] = {};
            }

            const value = post[key];

            profile[key][value] = (profile[key][value] || 0) + 1;
        });
    });

    return profile;
}

export function getRecommendations(savedPosts, viewedPosts, allPosts) {
    const profile = createUserProfile(savedPosts, viewedPosts);
    let recommendations = [];

    allPosts.forEach((post) => {
        let score = 0;

        Object.keys(profile).forEach((key) => {
            const value = post[key];
            if (profile[key][value]) {
                score += profile[key][value]; // Ha gyakran fordul elo.
            }
        });

        recommendations.push({ post, score });
    });

    // Sorrendezes pontszam szerint
    recommendations.sort((a, b) => b.score - a.score);

    return recommendations.slice(0, 10).map(r => r.post); // max 10.
}