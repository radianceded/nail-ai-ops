import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { submitTryOn } from "../services/api";
import type { NailStyle } from "../services/projectData";

interface TryOnPageProps {
  selectedNail: NailStyle | null;
  onBack: () => void;
  onHome: () => void;
}

const tagGroups: Array<keyof NailStyle["tags"]> = [
  "style",
  "color",
  "craft",
  "scene",
  "crowd",
];

interface HandImagePreview {
  source: "upload" | "example";
  url: string;
  label: string;
  file?: File;
}

export default function TryOnPage({
  selectedNail,
  onBack,
  onHome,
}: TryOnPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const generationTimerRef = useRef<number | null>(null);
  const [handImagePreview, setHandImagePreview] =
    useState<HandImagePreview | null>(null);
  const [isGeneratingResult, setIsGeneratingResult] = useState(false);
  const [showMockResult, setShowMockResult] = useState(false);
  const [tryOnMessage, setTryOnMessage] = useState(
    "当前为试戴预览效果，真实图像编辑接口已预留。",
  );
  const [tryOnResultImageUrl, setTryOnResultImageUrl] = useState<string | null>(
    null,
  );
  const [tryOnSource, setTryOnSource] = useState<"image_edit" | "mock">("mock");
  const [tryOnError, setTryOnError] = useState("");

  useEffect(() => {
    return () => {
      if (handImagePreview?.source === "upload") {
        URL.revokeObjectURL(handImagePreview.url);
      }
    };
  }, [handImagePreview]);

  useEffect(() => {
    return () => {
      if (generationTimerRef.current) {
        window.clearTimeout(generationTimerRef.current);
      }
    };
  }, []);

  if (!selectedNail) {
    return (
      <main className="try-on-page">
        <div className="page-actions">
          <button className="text-button" type="button" onClick={onBack}>
            返回推荐页
          </button>
          <button className="text-button" type="button" onClick={onHome}>
            回到首页
          </button>
        </div>
        <section className="try-on-page__empty">
          <h1>暂未选择美甲款式</h1>
          <p>请返回推荐页选择一款美甲后再进入试戴流程。</p>
        </section>
      </main>
    );
  }

  const tags = tagGroups.flatMap((group) => selectedNail.tags[group] ?? []);
  const detailItems = [
    selectedNail.popularity ? ["人气值", selectedNail.popularity] : null,
    selectedNail.difficulty ? ["难度", selectedNail.difficulty] : null,
    selectedNail.duration ? ["预计耗时", `${selectedNail.duration} 分钟`] : null,
    selectedNail.suitable_skin_tones?.length
      ? ["适合肤色", selectedNail.suitable_skin_tones.join("、")]
      : null,
    selectedNail.suitable_hand_types?.length
      ? ["适合手型", selectedNail.suitable_hand_types.join("、")]
      : null,
  ].filter(Boolean) as Array<[string, string | number]>;

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleHandImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setHandImagePreview({
      source: "upload",
      url: URL.createObjectURL(file),
      label: file.name,
      file,
    });
    setShowMockResult(false);
    setIsGeneratingResult(false);
    setTryOnResultImageUrl(null);
    setTryOnSource("mock");
    setTryOnError("");
    setTryOnMessage("当前为试戴预览效果，真实图像编辑接口已预留。");
  };

  const handleUseExampleHandImage = () => {
    // Demo placeholder: no dedicated hand image exists yet, so reuse the selected nail image as the local mock preview.
    setHandImagePreview({
      source: "example",
      url: selectedNail.image_path,
      label: "示例手图（demo placeholder）",
    });
    setShowMockResult(false);
    setIsGeneratingResult(false);
    setTryOnResultImageUrl(null);
    setTryOnSource("mock");
    setTryOnError("");
    setTryOnMessage("当前为试戴预览效果，真实图像编辑接口已预留。");
  };

  const showLocalMockResult = (message?: string) => {
    setTryOnResultImageUrl(null);
    setTryOnSource("mock");
    generationTimerRef.current = window.setTimeout(() => {
      setTryOnMessage(
        message ?? "当前为试戴预览效果，真实图像编辑接口已预留。",
      );
      setIsGeneratingResult(false);
      setShowMockResult(true);
    }, 1000);
  };

  const handleGenerateResult = async () => {
    if (!handImagePreview || isGeneratingResult) {
      return;
    }

    setIsGeneratingResult(true);
    setShowMockResult(false);
    setTryOnResultImageUrl(null);
    setTryOnSource("mock");
    setTryOnError("");

    if (generationTimerRef.current) {
      window.clearTimeout(generationTimerRef.current);
    }

    if (handImagePreview.source === "example" || !handImagePreview.file) {
      showLocalMockResult();
      return;
    }

    try {
      const result = await submitTryOn(
        handImagePreview.file,
        selectedNail.style_id,
      );
      setTryOnMessage(result.message);
      setTryOnResultImageUrl(result.result_image_url);
      setTryOnSource(result.source);
      setIsGeneratingResult(false);
      setShowMockResult(true);
    } catch (error) {
      console.error(error);
      setTryOnError("后端试戴接口暂不可用，已使用本地 mock 结果。");
      showLocalMockResult();
    }
  };

  const handleResetHandImage = () => {
    if (generationTimerRef.current) {
      window.clearTimeout(generationTimerRef.current);
    }

    setHandImagePreview(null);
    setShowMockResult(false);
    setIsGeneratingResult(false);
    setTryOnResultImageUrl(null);
    setTryOnSource("mock");
    setTryOnError("");
    setTryOnMessage("当前为试戴预览效果，真实图像编辑接口已预留。");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="try-on-page">
      <div className="page-actions">
        <button className="text-button" type="button" onClick={onBack}>
          返回推荐页
        </button>
        <button className="text-button" type="button" onClick={onHome}>
          回到首页
        </button>
      </div>

      <section className="try-on-page__content">
        <img
          className="try-on-page__image"
          src={selectedNail.image_path}
          alt={selectedNail.name}
        />
        <div className="try-on-page__detail">
          <p className="nail-card__id">{selectedNail.style_id}</p>
          <h1>{selectedNail.name}</h1>
          <div className="nail-card__tags" aria-label="已选择款式标签">
            {tags.map((tag, index) => (
              <span key={`${selectedNail.style_id}-${tag}-${index}`}>
                {tag}
              </span>
            ))}
          </div>
          <p className="try-on-page__description">
            {selectedNail.description}
          </p>
          <dl className="try-on-page__info">
            {detailItems.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <div className="try-on-page__actions">
            <input
              ref={fileInputRef}
              className="try-on-page__file-input"
              type="file"
              accept="image/*"
              onChange={handleHandImageChange}
            />
            <button
              className="secondary-button"
              type="button"
              onClick={handleUploadButtonClick}
            >
              上传我的手图
            </button>
            <button
              className="nail-card__button"
              type="button"
              onClick={handleUseExampleHandImage}
            >
              使用示例手图
            </button>
            <button
              className="nail-card__button"
              type="button"
              onClick={handleGenerateResult}
              disabled={!handImagePreview || isGeneratingResult}
            >
              {isGeneratingResult ? (
                <span className="pulse">AI 试戴结果生成中...</span>
              ) : (
                "生成试戴结果"
              )}
            </button>
            {handImagePreview ? (
              <button
                className="secondary-button"
                type="button"
                onClick={handleResetHandImage}
              >
                重新选择手图
              </button>
            ) : null}
          </div>

          {handImagePreview ? (
            <section className="try-on-page__hand-preview">
              <div>
                <span>手图预览</span>
                <strong>{handImagePreview.label}</strong>
              </div>
              <img src={handImagePreview.url} alt={handImagePreview.label} />
            </section>
          ) : null}

          {tryOnError ? (
            <p className="try-on-page__status try-on-page__status--error">
              {tryOnError}
            </p>
          ) : null}

          {showMockResult ? (
            <section className="try-on-page__result">
              <p className="try-on-page__status">
                结果来源：
                {tryOnSource === "image_edit"
                  ? "由图像编辑服务生成"
                  : "当前为试戴预览效果，真实图像编辑接口已预留"}
              </p>
              <div className="try-on-page__result-images">
                <figure>
                  <img src={selectedNail.image_path} alt={selectedNail.name} />
                  <figcaption>选中的美甲款式</figcaption>
                </figure>
                {handImagePreview ? (
                  <figure>
                    <img
                      src={handImagePreview.url}
                      alt={handImagePreview.label}
                    />
                    <figcaption>手图预览</figcaption>
                  </figure>
                ) : null}
                {tryOnResultImageUrl ? (
                  <figure>
                    <img src={tryOnResultImageUrl} alt="试戴预览图" />
                    <figcaption>试戴预览图</figcaption>
                  </figure>
                ) : null}
              </div>
              <p>{tryOnMessage}</p>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
