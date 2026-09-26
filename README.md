# 三角洲陪玩俱乐部 · 点单页面 Demo

手机端优先的静态单页 Demo，可直接由 GitHub Pages 从 `main` 分支根目录发布。无需构建或后端。

## 体验内容

- 浏览护航撤离、保底出货与趣味单的固定演示价格。
- 查看陪玩师的擅长地图、接单数、评价及在线状态；离线陪玩师不可选。
- 选择服务、陪玩师和数量，查看参考总价。
- 使用系统分享或复制选单给客服，由客服线下确认录单。页面不提供支付。

客服联系方式尚未确定，因此目前没有硬编码客服链接。待确认企业微信、微信二维码或其他入口后，可在分享交互中接入实际客服渠道。

所有服务价格、活动、人物资料、评价和在线状态均为展示数据，不代表实际承诺。主视觉与人物图为本 Demo 生成的虚构素材，不使用游戏官方素材或真实陪玩师照片。

## 本地预览

在本目录运行 `python -m http.server 8000`，打开 `http://localhost:8000/`。

## 素材说明

图片使用内置图像生成工具创作，并转换为 WebP 存于 `assets/`。主视觉提示词为：*cinematic extraction-shooter inspired fictional river delta at dusk, dark negative space for headline, warm champagne light, no text, no logos, no weapons in focus*。人物图提示词为：*three fictional East Asian young adult gaming companions in a refined cinematic triptych, dark olive and charcoal, no text or logos*。

