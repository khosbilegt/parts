package mn.random.company.dto;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.ws.rs.FormParam;
import org.jboss.resteasy.reactive.PartType;

@RegisterForReflection // Required for native image compilation
public class FileUploadForm {

    @FormParam("file")
    @PartType("application/octet-stream")
    public byte[] file;

    // You can add other form fields if needed
}